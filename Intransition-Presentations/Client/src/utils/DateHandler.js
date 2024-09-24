class DateHandler {
    static Format = (date) => {
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
        
        const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(new Date(date));
        const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(new Date(date));
        
        return `${formattedDate} ${formattedTime}`;
    }
}

export default DateHandler;