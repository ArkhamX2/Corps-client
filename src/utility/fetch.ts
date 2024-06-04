import { updateBackgroundResourceData } from "../store/backgroundResourceSlice";
import { updateCardResourceData } from "../store/cardResourceSlice";
import { updateUserResourceData } from "../store/userResourceSlice";
import { useAppDispatch } from "./hook";

const dispatch = useAppDispatch()

export const fetchCards = async () => {
    try {
        const response = await fetch('https://localhost:7017/api/resource/card');
        const data = await response.json();
        dispatch(updateCardResourceData({ dtos: data }));
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
};

export const fetchBackground = async () => {
    try {
        const response = await fetch('https://localhost:7017/api/resource/background');
        const data = await response.json();
        dispatch(updateBackgroundResourceData({ menu: data[0], board: data[1] }));
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
};

export const fetchUser = async () => {
    try {
        const response = await fetch('https://localhost:7017/api/resource/user');
        const data = await response.json();
        dispatch(updateUserResourceData({ dtos: data }));
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
};
