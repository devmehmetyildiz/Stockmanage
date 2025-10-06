import { ToastContainer } from 'react-toastify'
import AppRouter from './route'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@Api/Auth/slice';

export default function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    const bc = new BroadcastChannel('auth');
    bc.onmessage = (event) => {
      if (event.data?.type === 'TOKEN_REFRESHED') {
        const data = event?.data?.credentials ?? ''
        try {
          const parsedData = JSON.parse(data)
          dispatch(setCredentials(parsedData));
        } catch (error) {
          console.log("bc data parse error => ", data)
        }
      }
    };

    return () => bc.close();
  }, []);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <ToastContainer />
      <AppRouter />
    </div>
  )
}
