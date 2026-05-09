import { useState, useCallback, useEffect } from "react";
import { userAPI } from "../../api/adminAPI";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await userAPI.getAll();
            if (Array.isArray(res.data)) {
                setUsers(res.data);
            } else if (res.data && Array.isArray(res.data.data)) {
                setUsers(res.data.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const updateUser = useCallback(async (id, data) => {
        const res = await userAPI.update(id, data);
        refetch();
        return res;
    }, [refetch]);

    const deleteUser = useCallback(async (id) => {
        const res = await userAPI.delete(id);
        refetch();
        return res;
    }, [refetch]);

    return {
        users,
        loading,
        error,
        refetch,
        updateUser,
        deleteUser,
    };
};