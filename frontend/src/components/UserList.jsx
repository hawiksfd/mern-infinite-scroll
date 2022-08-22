import React,{ useState, useEffect } from 'react';
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const UserList = () => {

    // deklarasi variable useState
    const [users, setUsers] = useState([]);
    const [lastId, setLastId] = useState(0);
    const [tempId, setTempId] = useState(0);
    const [limit, setLimit] = useState(20);
    const [keyword, setKeyword] = useState('');
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {
        getUsers();
    }, [lastId, keyword]);          // depedency untuk perubahan last id dan keyword pencarian

    const getUsers = async () => {
        const response = await axios.get(
            `http://localhost:5000/users?search_query=${keyword}&lastId=${lastId}&limit=${limit}`
        );
        // ! membuat variable data baru setelah batas limit
        const newUsers = response.data.result;

        // ! ...users = spread operator
        setUsers([...users, ...newUsers]);

        // ! setter temporary id terakhir
        setTempId(response.data.lastId);

        // ! setter hasmore bernilai true
        setHasMore(response.data.hasMore);
    }

    const fetchMore = () => {
        setLastId(tempId)
    }

    return (
        <div className="container mt-5">
            <div className="columns">
                <div className="column is-centered">

                    <form>
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder='Find somthing here ...' />
                            </div>
                            <div className="control">
                                <button type='submit' className='button is-info'>Search</button>
                            </div>
                        </div>
                    </form>

                    <InfiniteScroll 
                        dataLength={users.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                    >
                        <table className='table is-stripped is-bordered is-fullwidth mt-2'>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.gender}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}

export default UserList
