import { useState } from 'react';
import axios from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate"

const useAPI = (axiosType = 'public') => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    const axiosInstance = axiosType === 'private' ? axiosPrivate : axios;

    const fetchData = async (method, url, body = null) => {
        setLoading(true);
        try {
            const response = await axiosInstance({
                method,
                url,
                data: body,
            });
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData };
};

export default useAPI;
