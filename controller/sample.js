import { sampleService } from "../service/sample.js";
import logger from "../util/loggers.js";


export function sampleController(req, res) {
    try {
        const data = sampleService();

        logger.info(data);

        res.status(200).send({
            status: "success",
            message: "sampleController"
        })
    } catch (error) {
        throw error;
    }
}    