const URL = import.meta.env.VITE_BACKEND_URL;

export async function Createorder(orderData) {
    try {
        const res = await fetch(`${URL}/order/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        return { data };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }   
}


export async function AllData() {
    try {
        const res = await fetch(`${URL}/order/allorder`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        const status = res.status;
        return { data, status };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


// ...existing code...

// Fetch all tables
export async function fetchTables() {
    try {
        const res = await fetch(`${URL}/table/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Add a new table
export async function addTable({ number, chairs }) {
    try {
        const res = await fetch(`${URL}/table/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number, chairs })
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Delete a table (you need a DELETE endpoint in backend)
export async function deleteTable(id) {
    try {
        const res = await fetch(`${URL}/table/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function fetchChefs() {
    try {
        const res = await fetch(`${URL}/order/allchefs`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function  tableorder(){
    try {
        const res = await fetch(`${URL}/table/with-orders`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function updatepickedup(id, pickedUp) {
    try {
        const res = await fetch(`${URL}/order/pickedup/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pickedUp }) // send the value
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function allOrdersWithTable() {
    try {
        const res = await fetch(`${URL}/order/allorder-with-table`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await res.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}