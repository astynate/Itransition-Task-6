import Wrapper from '../../elemets/wrapper/Wrapper';
import List from '../../features/list/List';
import PresentationTemplate from '../../features/presentation-template/PresentationTemplate';
import styles from './main.module.css';
import template_1 from './images/template_1.png';
import template_2 from './images/template_2.png';
import template_3 from './images/template_3.png';
import userState from '../../../../state/userState';

const Create = ({setPresentations}) => {
    const CreatePresentation = async () => {
        if (userState.username == null) {
            alert("Please login your account!");
            return;
        }

        let form = new FormData();

        form.append('username', userState.username);

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
                        onClick={() => CreatePresentation()}
                    />
                    <PresentationTemplate 
                        image={template_1}
                        name='Simple white'
                    />
                    <PresentationTemplate 
                        image={template_2}
                        name='Simple blue'
                    />
                    <PresentationTemplate 
                        image={template_3}
                        name='Simple black'
                    />
                </List>
            </Wrapper>
        </div>
    );
}

export default Create;