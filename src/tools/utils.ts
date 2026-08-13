export const countOcurrences = (content: string, target: string) => {
    return content.split(target).length - 1;
}