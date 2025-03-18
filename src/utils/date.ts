export function formatNotificationDate(dateString: string) {
    const notificationDate = new Date(dateString);
    const currentDate = new Date();

    // Calcular a diferença de tempo em milissegundos
    const diffTime = currentDate.getTime() - notificationDate.getTime();

    // Converter diferença de tempo para dias e horas
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays === 0) {
        return `${diffHours} horas atrás`;
    } else if (diffDays === 1) {
        return `1 dia atrás`;
    } else if (diffDays === 2) {
        return `2 dias atrás`;
    } else if (diffDays === 3) {
        return `3 dias atrás`;
    } else {
        return notificationDate.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }
};

export function formatLocaleDate(dateString: string, locale: string) {
    const date = new Date(dateString);
    const currentLocale = locale === "en" ? "en-US" : "pt-BR";
    
    return date.toLocaleDateString(currentLocale, {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

export function formatDateToDDMMYYYY(dateString: string): string {
    if(!dateString || dateString === "") return "";
    
    const [year, month, day] = dateString.split("-");
    
    return `${day}/${month}/${year}`;
}