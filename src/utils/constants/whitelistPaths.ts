const allowedPath = [
    '/auth/signin',
    '/auth/signup',
    '/movies/insertMovies',
    '/movies/searchMovies/:movieTitle',
    '/movies/updateMovies',
    '/movies/removeMovies',
    '/movies/allMovies',
    '/openList/insertNewOpenedMovies',
    '/openList/fetchOpenedMovies',
    '/orderMovie/createNewOrder',
    '/orderMovie/viewOrderHistory?name=*',
    '/orderMovie/deleteOrder?name=*&title=*'
]

export const checkPath = (path: string): boolean => {
    return allowedPath.some(allowed => {
        const regex = new RegExp('^' + allowed.replace(/:\w+/g, '[^/]+') + '$');
        return regex.test(path);
    });
}