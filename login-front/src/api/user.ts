import type { CreateUserPayload, User } from '../types/user'

export const createUser = async (payload: CreateUserPayload, token: string) => {
    const res = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        throw new Error('create user request failed')
    }
    const json: User = await res.json()
    return json
}

export const getUserItems = async (token: string) => {
    const res = await fetch('http://localhost:4000/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        throw new Error('get user request failed')
    }

    const json: User[] = await res.json()
    return json
}