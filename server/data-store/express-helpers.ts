// Int => Object => Object => Object
const sendResponse = statusCode => body => response => response.status(statusCode).send(body)
export const noContentResponse = response => response.sendStatusCode(204)
export const badRequestResponse = sendResponse(400)
export const internalServerErrorResponse = sendResponse(500)
export const createdResponse = sendResponse(201)
export const okResponse = sendResponse(200)

