
async function GetRequestsAdmin(accessToken) {
    const urlString = 'http://localhost:8081/api/requestManagement/v1/getRequests'
    try {
        const resp = await fetch(urlString, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (!resp.ok) {
            const message = await resp.text();
            return [[], message];
        }

        const data = await resp.json();
        return [data, ''];
    } catch (error) {
        console.error('Error:', error);
        return [[], error.toString()];
    }
}

async function ResponseRequest(accessToken, deviceId, approved) {
    const urlString = 'http://localhost:8081/api/requestManagement/v1/responseRequest/' + deviceId.toString()
    let url = new URL(urlString)
    url.searchParams.append("approved", approved)

    try {
        const resp = await fetch(url.toString(), {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const message = await resp.text();
        if (!resp.ok) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function AddDevice(accessToken, deviceDict) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/addDevice'

    try {
        const resp = await fetch(urlString, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(deviceDict)
        });
        const message = await resp.text();
        if (resp !== 201) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function DeleteDevice(accessToken, deviceId) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/deleteDevice/' + deviceId.toString()

    try {
        const resp = await fetch(urlString, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const message = await resp.text();
        if (resp !== 200) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function AddStockDevice(accessToken, deviceId, stock) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/addStock/' + deviceId.toString()
    let url = new URL(urlString)
    url.searchParams.append('stock', stock)
    try {
        const resp = await fetch(url.toString(), {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const message = await resp.text();
        if (!resp.ok) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function AddShopDevice(accessToken, deviceId, shop) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/addShop/' + deviceId.toString()
    let url = new URL(urlString)
    url.searchParams.append('shop', shop)

    try {
        const resp = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const message = await resp.text();
        if (!resp.ok) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function DeleteShopDevice(accessToken, deviceId, shop) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/deleteShop/' + deviceId.toString()
    let url = new URL(urlString)
    url.searchParams.append('shop', shop)
    try {
        const resp = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const message = await resp.text();
        if (!resp.ok) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function GetStockDevice(accessToken, deviceId) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/getStock/' + deviceId.toString()

    try {
        const resp = await fetch(urlString, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const message = await resp.text();
        if (!resp.ok) {
            return [false, message];
        }

        return [true, message];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

export {
    GetRequestsAdmin,
    ResponseRequest,
    AddDevice,
    DeleteDevice,
    AddStockDevice,
    AddShopDevice,
    DeleteShopDevice,
    GetStockDevice
};
