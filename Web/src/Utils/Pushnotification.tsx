import { toast, ToastOptions } from 'react-toastify';
import React from 'react';
import { store } from '@Api/store';
import { gatewayApi } from '@Api/api';

export interface NotificationProps {
    Type: 'Success' | 'Information' | 'Error',
    Subject: string,
    Description: string
}

const CustomToast: React.FC<{ title: string, message: string }> = ({ title, message }) => (
    <div>
        <strong>{title}</strong>
        <div>{message}</div>
    </div>
);

function Pushnotification(NotificationProps: NotificationProps[] | NotificationProps) {
    let props = NotificationProps as NotificationProps[]
    let notifications = Array.isArray(props) ? props : [props]

    const state = store.getState();

    const metaData = (gatewayApi.endpoints as any)?.getMeta.select()(state).data;

    const userConfig = metaData?.Config ? JSON.parse(metaData.Config) : {};
    const seperatedUserConfig = {
        position: (userConfig?.Position ? `top-${userConfig.Position}` : 'top-right') as ToastOptions['position'],
        autoClose: userConfig?.Duration ? parseInt(userConfig.Duration) : 5000,
    }

    let config: ToastOptions = {
        closeOnClick: true,
    }

    const decoratedConfig: ToastOptions = {
        ...config,
        ...(seperatedUserConfig)
    };

    if (notifications && notifications.length > 0) {
        notifications.forEach((notification) => {
            if (notification) {
                const { Type, Subject, Description } = notification
                switch (Type) {
                    case "Success":
                        toast.success(<CustomToast title={Subject} message={Description} />, decoratedConfig);
                        break;
                    case "Information":
                        toast.info(<CustomToast title={Subject} message={Description} />, decoratedConfig);
                        break;
                    case "Error":
                        toast.error(<CustomToast title={Subject} message={Description} />, decoratedConfig);
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

export default Pushnotification;