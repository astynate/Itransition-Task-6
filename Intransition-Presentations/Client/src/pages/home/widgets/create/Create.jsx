import Wrapper from '../../elemets/wrapper/Wrapper';
import List from '../../features/list/List';
import PresentationTemplate from '../../features/presentation-template/PresentationTemplate';
import styles from './main.module.css';
import template_1 from './images/template_1.png';
import template_2 from './images/template_2.png';
import template_3 from './images/template_3.png';
import userState from '../../../../state/userState';

const Create = ({setPresentations}) => {
    const CreatePresentation = async (type) => {
        if (userState.username == null) {
            alert("Please login your account!");
            return;
        }

        let form = new FormData();

        form.append('username', userState.username);
        form.append('type', type);

        await fetch('/api/presentations', {
            method: "POST",
            body: form
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
            setPresentations(prev => [response, ...prev]);
            window.open(`/presentation/${response.id}`, '_blank');
        });
    }

    return (
        <div className={styles.createWrapper}>
            <Wrapper>
                <List>
                    <PresentationTemplate 
                        onClick={() => CreatePresentation(0)}
                    />
                    <PresentationTemplate 
                        image={template_1}
                        name='Simple white'
                        onClick={() => CreatePresentation(1)}
                    />
                    <PresentationTemplate 
                        image={template_2}
                        name='Simple blue'
                        onClick={() => CreatePresentation(2)}
                    />
                    <PresentationTemplate 
                        image={template_3}
                        name='Simple black'
                        onClick={() => CreatePresentation(3)}
                    />
                </List>
            </Wrapper>
        </div>
    );
}

export default Create;