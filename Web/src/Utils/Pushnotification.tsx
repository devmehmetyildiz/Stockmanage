import { toast, ToastOptions } from 'react-toastify';

interface CustomToastProps {
    title: string,
    message: string
}

export interface NotificationProps {
    Type: 'Success' | 'Information' | 'Error',
    Subject: string,
    Description: string
}


const CustomToast: React.FC<CustomToastProps> = ({ title, message }) => (
    <div>
        <strong>{title} </strong>
        <div> {message} </div>
    </div>
);

function Pushnotification(NotificationProps: NotificationProps[] | NotificationProps) {

    let props = NotificationProps as NotificationProps[]
    let notifications = Array.isArray(props) ? props : [props]

    let config: ToastOptions = {
        closeOnClick: true,
    }

    if (notifications && notifications.length > 0) {
        notifications.forEach((notification) => {
            if (notification) {
                const { Type, Subject, Description } = notification
                switch (Type) {
                    case "Success":
                        toast.success(<CustomToast title={Subject} message={Description} />, config);
                        break;
                    case "Information":
                        toast.info(<CustomToast title={Subject} message={Description} />, config);
                        break;
                    case "Error":
                        toast.error(<CustomToast title={Subject} message={Description} />, config);

                        break;
                    default:
                        break;
                }
            } else {
                toast.error(<CustomToast title={"Notification Error"} message={"Notification Object Can't Read"} />, config);
            }
        })
    }
}

export default Pushnotification