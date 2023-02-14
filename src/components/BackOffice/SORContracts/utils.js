export const sanitizeInput = value => {
    return value.trim().replaceAll(' ', '')
}