import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { EnvelopeIcon ,PencilIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/16/solid";
import { useParams } from 'react-router-dom';
// import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/20/solid";

const Profile = () => {
  const user = useSelector(state => state.user);
  const {userId} = useParams();

  const backendUrl = process.env.REACT_APP_BASE_API_URL;
  const[posted , setPosted] = useState([]);

  const[username , setUserName] = useState('');
  const[email,setEmail] = useState('');
  const getProfileDetails = async() =>{
    try {
      const getUserProfile = await fetch(`${backendUrl}/food/recipies/author=${userId}`);
      const responseData = await getUserProfile.json();
      //console.log(responseData);
      setPosted(responseData);

    } catch (error) {
      console.error(error)
    }
  }
  const getUserInfo =async () =>{
    try {
      const userInfo = await fetch(`${backendUrl}/customers/users/register/${userId}`);
      const userInfoResponse = await userInfo.json();
      setEmail(userInfoResponse.email);
      setUserName(userInfoResponse.username);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getProfileDetails();
    getUserInfo();
  },[])

  const RecipeCard = ({post}) =>{


    return(
      <div className='w-full h-[30vh] bg-orange-600 backdrop-blur-md shadow-md'>

                {parseInt(userId) === user.userId &&
                <InformationCircleIcon className="h-6 w-6 text-black cursor-pointer  absolute right-2 top-2" />
                  }
                {/* <EllipsisVerticalIcon className="h-8 w-8 p-1 bg-white rounded-full text-black absolute right-2 top-2" /> */}

                <div className="h-3/4 w-full">
                  <img src={`http://127.0.0.1:8000/${post.image}`} className='w-full h-full' alt="" />
                </div>
                <div className="h-1/4 w-full text-white p-2">
                  <div className="flex flex-row items-center justify-between">
                    <p className='text-xl font-poppins'>{post.title}</p>
                    <p className='flex flex-row'>{post.average_score ? post.average_score : 0}<StarIcon className="h-4 w-4 text-yellow-400" /> ({post.number_of_ratings})</p>
                  </div>
                  
                  <p className='text-right text-slate-200 italic text-sm'>{post.date_published}</p>
                </div>
              </div>
    )
  }

  return (
    <div className='w-full min-h-[100vh] flex items-center justify-center '>
      <div className='md:w-[90%] p-8 w-full min-h-[90vh] flex flex-col items-center backdrop-blur-md shadow-xl rounded-lg mt-16  bg-white/80'>
      {parseInt(userId) === user.userId &&
        <div className='flex flex-row items-end justify-end w-full'>
          <button className='px-4 py-1 bg-red-600 hover:bg-red-800 transition duration-300 ease-in-out text-white text-lg font-poppins rounded-full'>Edit Profile</button>
        </div>
}
          <div className='flex flex-col md:flex-row  w-full  md:w-2/3 lg:w-2/4 gap-2 md:gap-12'>
            <div  className={`w-20 h-20 flex flex-row items-center font-bold text-white justify-center 
             bg-orange-600 rounded-full text-5xl
              ${username === '' && 'animate-pulse'}
             `}>
              {username[0]}
              {/* <PencilIcon className="h-6 w-6 text-gray-500 absolute" /> */}
            </div>
            <div className='font-poppins flex flex-col gap-5'>
              <div>
                <p className='text-2xl'>
                  {username}
                </p>
                <p className='flex flex-row items-center gap-2 italic'><EnvelopeIcon className="h-5 w-5 text-gray-500" />{email}</p>
              </div>
              <div>
                <p>Posts . {posted.length}</p>
                <p className='flex flex-row items-center gap-2'>Bookmarks . 0 <BookmarkIcon className="h-5 w-4 text-orange-500" /></p>
              </div>
              
            </div>
          </div>

          <div className={`w-full ${parseInt(userId) === user.userId && 'grid grid-cols-2 gap-4'}  my-8`}>
            <button className='w-full text-2xl p-4 border-b-4 border-slate-600'>Posts</button>
            {parseInt(userId) === user.userId &&
            <button className='w-full text-2xl p-4'>Saved</button>
          }
          </div>
          
          <div className='w-full grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 '>
            {posted.map((post,id) =>(
              <RecipeCard key={id} post={post}/>
            ))}
          </div>

          
      </div>
    </div>
  )
}

export default Profile