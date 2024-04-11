const getBackendDate = (date?: Date) => {
    if (!date) return undefined;
    /**
     * увеличение даты на один день
     * (из-за GMT+0300, который не принимается бэком)
     */
    date.setDate(date.getDate() + 1);

    return date.toISOString().split('T')[0];
};

export default getBackendDate;
