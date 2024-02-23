import React, { useEffect, useState } from 'react';
import '../index.css';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import cooking from '../images/Cooking.gif'
import RecipeSection from '../components/WelcomeComponents/RecipeSection';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const Welcome = () => {
  const backendUrl = process.env.REACT_APP_BASE_API_URL;
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const[recipies , setRecipies] = useState([]);
  const[categories , setCategories] = useState([]);
  const [users , setUsers] = useState([]);
  const[activeCategory , setActiveCategory] = useState('');

  const[currentPage , setCurrentPage] = useState(1);
  const[cardsPerPage] = useState(8);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentItems = recipies.slice(indexOfFirstCard,indexOfLastCard);

  const[isModalOpen , setIsModalOpen] = useState(false);
  const[openPage , setOpenPage] = useState('');


  const pageNumbers = []

  for(let i = 1 ; i <= Math.ceil(recipies.length / cardsPerPage) ; i++){
    pageNumbers.push(i);
  }

  const recipeList =async () =>{
    
    const fetchRecipe = await fetch(`${backendUrl}/food/recipies/${activeCategory}`);
    const fetchRecipeResponse = await fetchRecipe.json();   
    setRecipies(fetchRecipeResponse);
  }

  const categoryList = async() =>{
    const fetchCategories = await fetch(`${backendUrl}/food/categories/`);
    const fetchCategoriesResponse = await fetchCategories.json();
    setCategories(fetchCategoriesResponse);
    console.log(fetchCategoriesResponse)
  }
  const getUsers = async(id) =>{
    const response = await fetch(`http://127.0.0.1:8000/api/v1/customers/users/register/`);
    const responseData = await response.json();
    console.log(responseData);
    setUsers(responseData)
  }
  
  
  const handleCategory = (index) =>{
    setActiveCategory(index);
    setCurrentPage(1);
  }

  const newRecipeShareNavigation =() =>{
    if(user){
      navigate('/recipe');
    }
    else{
      setIsModalOpen(true);
      setOpenPage('login')
    }
  }

  const modalOpen = (openPage) =>{
    setIsModalOpen(true);
    setOpenPage(openPage);
  }

  const modalClose = () =>{
    setIsModalOpen(false);
    setOpenPage('')
  }

  useEffect(() => {
    categoryList();
  },[])
  useEffect(() =>{
    recipeList();
  },[activeCategory])
  useEffect(() => {
    getUsers();
  },[])
    

  return (
    <div>
      <Modal isOpen={isModalOpen} openPage={openPage} setOpenPage={setOpenPage} onClose={modalClose}  />
        <div className='welcome flex flex-col items-center justify-center'>
          <div className='bg-slate-800/60 py-12  w-full flex items-center justify-center flex-col gap-6 text-white'>
            <div className='text-7xl text-center font-bold'>
              <p className='text-orange-600'>Where every bite unfolds a story.</p>
              <p >In every dish, a journey discovered.</p> 
            </div>
            
            
            <button onClick={newRecipeShareNavigation} className='px-6 font-poppins py-2 bg-orange-500 transition duration-200 hover:bg-orange-700 rounded-sm hover:scale-105 text-xl text-[#F0F8FF]  shadow-md shadow-black'>
               Begin Your Culinary Journey
            </button>
            
            
            
          </div>
          
        </div>

        <div id='featured' className='flex flex-col items-center w-[100vw] bg-gradient-to-r from-orange-700 to-orange-500 text-white'>
        <div className='w-full flex flex-col items-center justify-center mb-4'>
            <img className='h-[20vh] w-[10vw]' src={cooking} alt="" />
            <p className='text-6xl   font-culina-share'>Featured Recipes</p>
        </div>
        

        <div className='flex w-full flex-col items-center justify-center gap-6'>
          <div className='w-[60%] font-poppins bg-white/30 px-4 py-2 rounded-full flex backdrop-blur-md shadow-md'>
            <input className='bg-transparent flex-1 focus:border-none outline-none text-white font-light placeholder-white  placeholder:text-sm  placeholder:italic  text-lg ' type="text" placeholder='What do you wanna cook today? ' />
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </div>
          
          <div className='flex flex-row items-center gap-5 w-[60%] text-lg font-semibold'>
              <button  onClick={()=> handleCategory('')} className={`px-4 py-1 text-lg font-light font-poppins  rounded-full ${activeCategory === '' ? ' text-slate-600  bg-white ':'  backdrop-blur-md shadow-md bg-white/20'}`} >
                All
              </button>
            {categories.map((category , index) => (
              <button key={index} onClick={()=> handleCategory(category.id)} className={`px-4 py-1 text-lg font-light font-poppins   rounded-full ${activeCategory === category.id ? ' text-slate-600  bg-white ':' backdrop-blur-md shadow-md bg-white/20'}`} >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <RecipeSection currentItems={currentItems} categories={categories} users={users} />

        <div className='flex flex-row my-4 items-center justify-center w-full gap-4'>
              {pageNumbers.length>1 && pageNumbers.map((page) =>(
                <button onClick={()=>setCurrentPage(page)} key={page} className={` h-12 w-12 text-xl rounded-md border border-white ${currentPage === page && 'bg-slate-800 text-orange-600'}`}>
                  {page}
                </button>
              ))}
        </div>
        
        </div>
    </div>
  )
}

export default Welcome