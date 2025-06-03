

async function GetDevicesHandle(accessToken, category, name) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1'
    let url;
    if (category === '' && name === '') {
        url = new URL(urlString + '/getAllDevices')
    } else if (name !== '') {
        url = new URL(urlString + '/getDeviceByName')
        url.searchParams.append('deviceName', name)
    } else if (category !== '') {
        url = new URL(urlString + '/getDevicesByCategory')
        url.searchParams.append('category', category)
    }

    try {
        const resp = await fetch(url.toString(), {
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

async function GetCategories(accessToken) {
    const urlString = 'http://localhost:8081/api/deviceManagement/v1/getCategories'

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


async function GetEmployeeRequests(accessToken) {
    const urlString = 'http://localhost:8081/api/requestManagement/v1/getMyRequests'

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

async function AddRequestEmployee(accessToken, deviceId, units) {
    const bodyReq = {'deviceId': deviceId, 'units': units}

    const urlString = 'http://localhost:8081/api/requestManagement/v1/requestDevice'
    try {
        const resp = await fetch(urlString, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyReq),
        });

        if (!resp.ok) {
            const message = await resp.text();
            return [false, message];
        }

        const data = await resp.text();
        return [true, data];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}

async function AddFeedback(accessToken, feedback) {
    const urlString = 'http://localhost:8081/api/auth/v1/sendFeedback'
    try {
        const resp = await fetch(urlString, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'feedback': feedback}),
        });

        if (!resp.ok) {
            const message = await resp.text();
            return [false, message];
        }

        const data = await resp.text();
        return [true, data];
    } catch (error) {
        console.error('Error:', error);
        return [false, error.toString()];
    }
}


export { AddRequestEmployee, GetDevicesHandle, GetEmployeeRequests, GetCategories, AddFeedback };