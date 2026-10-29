export function formatDate(date) {
    return date.toLocaleDateString("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric",
    })
}

export function getGreeting(date = new Date()) {
    const hour = date.getHours()

    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
}
