import React, {ChangeEvent, useEffect, useState} from 'react';
import {AddDiamond} from "./component/AddDiamond";
import {UpdateDiamond} from "./component/UpdateDiamond";
import {Table, Button, Badge} from 'antd';

const headers = localStorage.getItem('token');

interface DiamondData {
    diamondId: string;
    carat: string;
    price: string;
    cut: string;
    color: string;
    clarity: string;
    certification: string;
    status: boolean;
}

export const Diamond: React.FC = () => {
    const [dataSource, setDataSource] = useState<DiamondData[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<DiamondData>({
        diamondId: '',
        carat: '',
        price: '',
        cut: '',
        color: '',
        clarity: '',
        certification: '',
        status: true
    });

    const toggleAddModal = () => {
        setFormData({
            diamondId: '',
            carat: '',
            price: '',
            cut: '',
            color: '',
            clarity: '',
            certification: '',
            status: true
        });
        setIsAddingNew(!isAddingNew);
    }

    const toggleUpdateModal = () => {
        setIsUpdating(false);
    };


    useEffect(() => {
        fetchDiamond();
    }, []);


    const fetchDiamond = async () => {
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond/get-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDataSource(data || []);
            } else {
                console.error('Failed to fetch promotions');
            }

        } catch (error) {
            console.error('Error fetching promotions: ', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            console.log(formData)
            if (response.ok) {
                setIsAddingNew(false);
                fetchDiamond()
            } else {
                console.error('Failed to create diamond');
            }
        } catch (error) {
            console.error('Error creating diamond: ', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            console.log(formData)

            if (response.ok) {
                setIsUpdating(false);
                fetchDiamond();
            } else {
                console.error('Failed to update diamond');
            }
        } catch (error) {
            console.error('Error update diamond: ', error);
        }
    };


    const handleEdit = (diamondId: string) => {
        const promotionToEdit = dataSource.find(diamond => diamond.diamondId === diamondId);
        if (promotionToEdit) {
            setFormData(promotionToEdit);
            setIsUpdating(true);
        }
    };

    // const handleDelete = async (e: React.FormEvent, diamondId: string) => {
    //     e.preventDefault();
    //     console.log(diamondId)
    //     try {
    //         const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond/delete/${diamondId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Bearer ${headers}`
    //             }
    //         });
    //         if (response.ok) {
    //             fetchDiamond();
    //         } else {
    //             console.error('Failed to delete diamond');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting diamond: ', error);
    //     }
    // };

    const columns = [
        {title: 'ID', dataIndex: 'diamondId', key: 'diamondId'},
        {title: 'Carat', dataIndex: 'carat', key: 'carat'},
        {title: 'Cut', dataIndex: 'cut', key: 'cut'},
        {title: 'Clarity', dataIndex: 'clarity', key: 'clarity'},
        {title: 'Color', dataIndex: 'color', key: 'color'},
        {title: 'Price', dataIndex: 'price', key: 'price', render: (text: string) => `$${text}`},
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (status: boolean) => (
                <Badge status={status ? "success" : "error"} text={status ? "On sale" : ""}/>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: DiamondData) => (
                <Button onClick={() => handleEdit(record.diamondId)}>Edit</Button>
            ),
        },
    ];
    return (
        <div className="container mt-5">
            <Button type="primary" onClick={() => setIsAddingNew(true)}>New Diamond</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 20, showSizeChanger: false}}/>
            <AddDiamond
                isOpen={isAddingNew}
                onClose={toggleAddModal}
                onSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
            />
            <UpdateDiamond
                isOpen={isUpdating}
                onClose={toggleUpdateModal}
                onSubmit={handleUpdate}
                formData={formData}
                handleChange={handleChange}
            />
        </div>
    );
};

