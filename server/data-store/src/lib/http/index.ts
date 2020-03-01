
export const parseTokenFromHeaders = req => new Promise((resolve, _reject) =>
    resolve([req]
        .map(parseHeaders)
        .map(parseAuthorization)
        .map(bearer => bearer.split(' ')[1])[0]
    ))

export const parseUserIdFromToken = token => token.uid

const parseHeaders = req => {
    if (req.headers == null) throw new Error('Missing headers')
    return req.headers
}

const parseAuthorization = headers => {
    if (headers.authorization == null) throw new Error('Missing authorization header')
    return headers.authorization
}
