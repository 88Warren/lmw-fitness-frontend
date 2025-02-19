import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
    const handleClick = () => {
        window.scrollTo(0, 0);
      };

    return (
        <section className='text-center flex flex-col justify-center items-center h-96'>
            <FaExclamationTriangle className='text-yellow-400 text-6xl mb-4' />
            <h1 className='font-oswald text-6xl font-bold mb-4'>404 Not Found</h1>
            <p className='font-poppins text-xl mb-5'>This page does not exist</p>
            <Link to='/' onClick={handleClick} className='text-white bg-vibrantBlue hover:bg-deepBlue rounded-md px-3 py-2 mt-4'>Go Back</Link>
        </section>
    );
};

export default NotFoundPage;