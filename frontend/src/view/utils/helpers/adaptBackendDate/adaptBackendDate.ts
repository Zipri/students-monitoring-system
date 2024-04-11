const adaptBackendDate = (backDate?: string) => {
    const date = backDate ? new Date(backDate) : undefined;
    return date;
};

export default adaptBackendDate;
