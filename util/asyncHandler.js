
export function asyncHandler(requestHandlerFn) {
    return async (req, res, next) => {
        try {
            await requestHandlerFn(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

// Using Promise
// export function asyncHandler(requestHandlerFn) {
//     return (req, res, next) => {
//         Promise
//             .resolve(() => {
//                 requestHandlerFn(req, res, next);
//             })
//             .catch((error) => next(error));
//     }
// }