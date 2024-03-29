import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'

const MyPage = () => {
  const user = useSelector(state => state.login.currentUser)
  const navigate = useNavigate()
  const [data, setData] = useState([])
  useEffect(() =>{
    let req = {
      user_id: user.id
    }
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/mycollections`, req)
    .then(res => {
        setData(res.data)
    })
    .catch(err => console.log(err))
  }, [])

  const [checkedItems, setCheckedItems] = useState({})
  const [allChecked, setAllChecked] = useState(false)

  const handleCheckboxChange = (event) => {
    setCheckedItems(prev => ({...prev, [event.target.name]: event.target.checked}));
    console.log(checkedItems)
    let updCheckedItems = {...checkedItems, [event.target.name]: event.target.checked}
    if (Object.values(updCheckedItems).length === data.length) {
      setAllChecked(Object.values(updCheckedItems).every(checked => checked === true))
    }
    else {setAllChecked(false)}
    console.log('updcheckeditems', Object.values(updCheckedItems))
    
  }
  const handleCheckboxChangeAll = (event) => {
    let result = {}
    setAllChecked(event.target.checked)
    for (let i in data) {
      result[data[i].id] = event.target.checked
    }
    setCheckedItems(result)
  }
  const handleDelete = () => {
    let data = {
      ids: [],
      user_id: user.id
    }
    for (let id in checkedItems) {checkedItems[id] && data.ids.push(id)}
    console.log(data)
    if (data.ids.length) {
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/delete`, data)
      .then(res => {
        console.log(res)
        setData(res.data)
      })
      .catch(err => console.log(err))
    }    
  }
  const handleCollectionPage = (e, coll_id) => {
    e.preventDefault()
    navigate(`/collection-page/${coll_id}`)
  }
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='d-flex flex-column w-75'>
        <div className='d-flex justify-content-between my-4'>
        <h3>My Collections</h3>
          <div>
            <NavLink to='new-collection' className='btn btn-outline-dark me-2'>
            <img src={New} width={25} height={25}/> New
            </NavLink>
            <button className='btn btn-outline-dark' onClick={handleDelete}>
            <img src={Trash} width={25} height={25}/> Delete
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th >
                <input className="form-check-input me-1" type="checkbox" checked={allChecked} onChange={handleCheckboxChangeAll}/>
              </th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => {
              return (<tr key={val.id} onClick={(e) => handleCollectionPage(e, val.id)}>
                <td>
                  <input 
                    type="checkbox"
                    name={val.id}
                    checked={checkedItems[val.id]}
                    onChange={handleCheckboxChange}
                  />
                  </td>
                  <td>{val.collection_name}</td>
                  <td>{val.description}</td>
                  <td>{val.category_name}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyPage