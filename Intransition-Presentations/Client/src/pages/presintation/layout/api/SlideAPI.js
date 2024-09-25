class SlideAPI {
    static AddSlide = async (presentationId) => {
        let form = new FormData();

        form.append('username', localStorage.getItem('username'));
        form.append('presentationId', presentationId);

        await fetch('/api/presentations/slide', {
            method: "POST",
            body: form
        });
    }

    static DeleteSlide = async (presentationId, sliadeId) => {
        let form = new FormData();

        form.append('slideId', sliadeId);
        form.append('presentationId', presentationId);

        await fetch('/api/presentations/slide', {
            method: "DELETE",
            body: form
        });
    }
}

export default SlideAPI;