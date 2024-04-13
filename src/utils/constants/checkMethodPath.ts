const methodPath = {
    'post': ['/auth/signin', '/auth/signup', '/movies/insertMovies', '/openList/insertNewOpenedMovies', '/orderMovie/createNewOrder'],
    'get': ['/home', '/movies/searchMovies/:movieTitle', '/movies/allMovies', '/openList/fetchOpenedMovies', '/orderMovie/viewOrderHistory?name=*'],
    'patch': ['/movies/updateMovies'],
    'delete': ['/movies/removeMovies', '/orderMovie/deleteOrder?name=*&title=*']
}

export const checkMethod = (method: string, path: string): boolean => {
    const paths: string[] = methodPath[method.toLowerCase()]

    if(!paths) return false

    const normalizedPaths = paths.map(p => p.split('/').map(seg => seg.startsWith(':') ? '*' : seg));
    const pathSegments = path.split('/');

    return normalizedPaths.some(normPath => {
        // Ensure the lengths match
        if (normPath.length !== pathSegments.length) return false;

        // Compare segments
        return normPath.every((seg, index) => seg === '*' || seg === pathSegments[index]);
    });
}