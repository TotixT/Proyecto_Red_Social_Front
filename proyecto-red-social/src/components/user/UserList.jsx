import React from "react";
import avatars from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ReactTimeAgo from "react-time-ago";

export const UserList = ({ users, getUsers, following, setFollowing,
    page, setPage, more, loading }) => {

    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
    }

    const follow = async (userId) => {
        const token = localStorage.getItem("token");
        // Peticion al backend para guardar follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();

        // Cuando este esto correcto

        if (data.status == "Success") {

            // Actualizar estado de following , agregando el nuevo follow

            setFollowing([...following, userId])

        }

    }

    const unfollow = async (userId) => {
        const token = localStorage.getItem("token");
        // Peticion al backend para borrar follow
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();

        // Cuando este esto correcto

        if (data.status == "Success") {

            // Actualizar estado de following , 
            // filtrando los datos para eliminar el antiguo userId
            // que acaba de dejar de seguir

            let filterFollowings = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowings);

        }
    }

    return (
        <>
            <div className="content__posts">

                {users.map(user => {
                    return (
                        <article className="posts__post" key={user._id} >

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/perfil/"+user._id} className="post__image-link">
                                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.png" && <img src={avatars} className="post__user-image" alt="Foto de perfil" />}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/"+user._id} className="user-info__name">{user.name} {user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/perfil/"+user._id} className="user-info__create-date"> <ReactTimeAgo date={user.create_at} locale="es-ES" /></Link>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>

                            {/* Solo mostrar botones cuando el usuario no es
                            con el que estoy identificado */}
                            {user._id != auth._id &&
                                <div className="post__buttons">

                                    {!following.includes(user._id) &&
                                        <button className="post__button post__button--green"
                                            onClick={() => follow(user._id)}>
                                            Seguir
                                        </button>
                                    }

                                    {following.includes(user._id) &&
                                        <button className="post__button"
                                            onClick={() => unfollow(user._id)}>
                                            Deja de Seguir
                                        </button>
                                    }

                                </div>
                            }

                        </article>
                    );
                })}

            </div>

            {loading ? <div>Cargando...</div> : ""}

            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas personas
                    </button>
                </div>
            }

        </>
    )
}