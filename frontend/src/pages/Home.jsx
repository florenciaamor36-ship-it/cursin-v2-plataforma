import Courses from '../components/Courses';
import coursesData from '../data/courses.json';

const Home = () => {
  return (
    <>
      <Courses coursesData={coursesData}/>
    </>
  )
}

export default Home;
