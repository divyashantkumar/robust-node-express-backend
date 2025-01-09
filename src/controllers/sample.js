import { sampleService } from "../services/sample.js";
import logger from "../utils/loggers.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// export function sampleController(req, res) {
//     try {
//         const data = sampleService();
//         logger.info(data);

//         res.status(200).send({
//             status: "success",
//             message: "sampleController"
//         })
//     } catch (error) {
//         throw error;
//     }
// }    

export const sampleController = asyncHandler(async (req, res) => {
    const data = sampleService();

    logger.info(data);

    res
        .status(200)
        .send(new ApiResponse(200, { data: "sample" }, "sampleController"));
})
