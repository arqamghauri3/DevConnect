import axios from "axios";
import { UserData } from "@/types/UserData";

export const fetchUser = async (username: string): Promise<UserData | null> => {

    const { data } = await axios.get(`/api/user?username=${username}`);
    return data?.username ?? null

}

export const fetchIsFollowing = async (follower: string | undefined, following: string | undefined): Promise<boolean> => {
    const { data } = await axios.get(`/api/follow?follower=${follower}&following=${following}`);
    return data.success === true;
}

export const followUser = async (follower: string | undefined, following: string | undefined) => {
    return axios.post("/api/follow", { follower, following });
};

export const unfollowUser = async (follower: string | undefined, following: string | undefined) => {
    return axios.delete("/api/follow", { data: { follower, following } });
};

export const editProfile = async (username: string, link: string | undefined, profilePicture: File | null) => {
    const formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('link', link || '');

    if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
    }
    console.log(formDataToSend);


    return await axios.put(`/api/user`, formDataToSend, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const normalizeLink = (link: string) => {
    if (!link) return '';
    if (link.startsWith('http://') || link.startsWith('https://')) {
        return link;
    }
    else {
        return `https://${link}`
    }
} 


export const getFollowersFollowing = async(userID: string | undefined) => {
    const { data } = await axios.get(`/api/follow/all?follower=${userID}&following=${userID}`);
    console.log(data);
    return data;
    
    
}