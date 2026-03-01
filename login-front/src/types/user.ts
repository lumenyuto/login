export type User = {
    sub: string | null
    name: string
    email: string | null
}

export type CreateUserPayload = {
    sub: string
    name: string
    email: string
}