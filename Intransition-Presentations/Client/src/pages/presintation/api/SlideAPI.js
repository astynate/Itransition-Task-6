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
        form.append('username', localStorage.getItem('username'));

        await fetch('/api/presentations/slide', {
            method: "DELETE",
            body: form
        });
    }

    static DeleteText = async (presentationId, id) => {
        let form = new FormData();

        form.append('id', id);
        form.append('presentationId', presentationId);

        await fetch('/api/texts', {
            method: "DELETE",
            body: form
        });
    }

    static AddTextOrUpdate = async (params, isUpdate = false, id) => {
        let form = new FormData();

        if (id) { form.append('Id', id); }

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                form.append(key, params[key]);
            }
        }

        await fetch('/api/texts', {
            method: isUpdate ? "PUT" : "POST",
            body: form
        });
    }
}

export default SlideAPI;