import { toast, ToastOptions } from 'react-toastify';
import React from 'react';
import { store } from '@Api/store';
import { gatewayApi } from '@Api/api';

interface PushNotificationProps {
    Type: 'Success' | 'Information' | 'Error',
    config?: ToastOptions,
    Subject: string,
    Description: string
}

const CustomToast: React.FC<{ title: string, message: string }> = ({ title, message }) => (
    <div>
        <strong>{title}</strong>
        <div>{message}</div>
    </div>
);

const Pushnotification = ({ Subject, config, Description, Type }: PushNotificationProps) => {
    const state = store.getState();

    const metaData = (gatewayApi.endpoints as any)?.getMeta.select()(state).data;

    const userConfig = metaData?.Config ? JSON.parse(metaData.Config) : {};
    const seperatedUserConfig = {
        position: (userConfig?.Position ? `top-${userConfig.Position}` : 'top-right' ) as ToastOptions['position'],
        autoClose: userConfig?.Duration ? parseInt(userConfig.Duration) : 5000,
    }

    const decoratedConfig: ToastOptions = {
        ...config,
        ...(seperatedUserConfig)
    };

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
    }
}

export default Pushnotification;