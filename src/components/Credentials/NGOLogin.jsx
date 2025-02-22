import React, { useState } from 'react';
import './NGOLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function NGOLogin() {
    const [errorMessage, setErrorMessage] = useState(''); // For error messages
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        

        // Send the POST request to login
        axios.post('http://localhost:3001/login', formData,{ withCredentials: true }) 
        .then(result => {
        console.log('Login response:', result);

        // Check the response structure
        if (result.data && result.data.message === 'Login successful to NGO') {
            navigate('/home');
        } else if (result.data && result.data.message === 'Lessgo') {
            navigate('/list-surplus');
        } else {
            // Handle unexpected messages or responses
            setErrorMessage('Unexpected response from the server.');
        }
    })
    .catch(err => {
        if (err.response) {
            // Handle error responses
            if (err.response.status === 401) {
                setErrorMessage('Incorrect password');
            } else if (err.response.status === 404) {
                setErrorMessage('User not found');
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        } else if (err.request) {
            // Handle network errors
            setErrorMessage('Failed to connect to the server. Please check your connection.');
        } else {
            // Handle any other errors
            setErrorMessage('An unexpected error occurred.');
        }

        console.error('Login error:', err);
    });

    };

    return (
        <div className="container-l">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email ID"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="error-message" style={{ color: 'red' }}>
                    {errorMessage}
                </div>

                <button type="submit" className="continue-button">
                    Login
                </button>
                
               
            </form>
            <Link to='/register'><button type="submit" className="continue-button">
                    SignUp
                </button></Link>
            
                <div className="social-login">
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8SEBUSEhIVFhUVFRcaExUWGBUbFxUYGxUXFhUVFSAhHSggGB0lGxcXITEhJSorLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi8lICUvLS0wNSstLy4yLzAvLS0tLS0tLS0tLS01Ly0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAEBAAIDAQAAAAAAAAAAAAAAAQUGAgQHA//EAEQQAAECAwUFBQMKBAUFAQAAAAEAAgMREgQhMTJBBSJRYYEGcZGh8BPB0QcUM0JSU2JygrEWssLSI0Nzg6I0Y5Lh8ST/xAAbAQEAAgMBAQAAAAAAAAAAAAAABAUCAwYBB//EADcRAQACAQICBgcIAgIDAAAAAAABAgMEEQUhEjFBUVJxExRhkbHB0SIyM0KBoeHwFSMG8VNygv/aAAwDAQACEQMRAD8A9qc6q4IAdIU6oDdzHXgggbI1aIDhVeEFc6q4IAdIU6oDdzHXgggbI1aIDhVeEFc6q4IAdIU6oDdzHXgggbI1aIDhVeEFc6q4IAdIU6oDdzHXgggbI1aIDhVeEFc6q4IAdIU6oDdzHXgggbI1aIDhVeEFc6q4IAdIU6oDdzHXggvzgc0EcAMuKAAJTOb1JAbfm6TQQEzkcvqSA6Yy4IK4AZcUAASmc3qSA2/N0ncggJnI5fUkBxIy4ckGO2lt6xwM0ZgcMWg1O8BMhar5qU65SsOh1Gb7lJ290e+Wv2v5QIA+jgveeLiGDv1PktE6yvZCzx8Cyz9+0R5c/oxNp7f2p2WHCb3hzj+4HktU6y/ZEJlOBYY+9aZ90fV04nbW3n/MaBwDG+8FYTqsne3xwfSx2TP6uDe2W0BhG/4Qv7V56zl72f8AiNJ4f3n6vrC7b25v1oZ72D3SWUarI1zwbSz2TH6u/Z/lBjD6SAxx4tc5v71LONZbthHycBxz9y8x5xv9GZsXbuyPuiiJD5kVN/43+S3V1dJ6+SBl4JqKc67W/b4tgsG0IMb6OI17daSDLhPUdVIretuqVZlwZMU7ZKzHm7LpjLgsmpXADLigACUzm9SQG35uk7kEBM5HL6kgOmMuCCuAGXFAAEpnN6kgNvzdJ3ILQzl4oJTRfigUz3vLuQM/KSBVPd80Cqm7FAppvxQKZ73l3II41cpINY2123s8IFkIe1eLpgyYP1a9J96i5NVWvKOa30vB82Xa1/sx+/u+rSNp9pbXHmHRC1v2Ie63rq7qSod8979cr/T8O0+DnWu8988/4YgBaU5UeogICAgICDlDeWkOaSCMCCQR3EYL2J2neGNqxaNpjeGz7G7b2qDuxJRmfiuf0dr1B71Ipqr15TzVOp4Phyc6fZn9vd9G7bE7Q2a0fRv39YbrnjjL7Q5ianY81cnU57VaDNp/vxy746v75svTPe8u5bUMz8pIFU93zQKqbsUCmm/FApnveXcgZ+UkD5vzQRoIzYIBBnMZfU0Fdfl6yuQDKUhm9TQGkDNigjQRmwQY7bW2YNmbXEdccrBmfxDR7zcteTJXHG8pOl0mTU26NI/Xsh5vt/tNHtU2nch6Q24H85+v+3JVuXPbJ7IdZo+G4dNz67d8/Lu+LBrSsBAQEBAQEBAQEBAQVpIMwZEXgjEHiEeTETG0tx7O9tnsIh2klzPvBmaPxD6w5496mYtVMcrqLW8Grfe+DlPd2fp3fDyegQozYjQ+E4OaRMOabiFPiYmN4c1elqTNbRtMPoZSkM3qa9YjSBmxQRoIzYIBBnMZfU0Fdfl6yuQcaH8/FBWuquKAXSNOnxQV27hqgFshVqgNFV5Qa/2o7TsszaQA6KRus0H4n8ByxPmNGbPGPl2rHQcPvqZ3nlWO35R/eTzC22uJFeYkRxc44k+QHAcgqu1ptO8uvxYaYqRSkbQ+C8bRAQEBAQEBAQEBAQEBAQbd8nr7WIp9n9B/m1TpnK6j8eGGmOil6Xp9Ll1KPjUafoR0/v8AZt1/r7P7D0gtkKtVYuWGiq8oI01XFALpGnT4oK7dw1Qcfbu5IOTnVXBAnIU6oDd3HVBA2Rq0QYLtb2hbZoc2yMVwkxp04vdyHmestGbN6OPasOH6G2pvz+7HX9IeV2iM+I9z3uLnOM3OOJKq5mZneXZUpWlYrWNoh814zEBAQEBAQEBAQEBAQEBBmOzewYlriSE2wwd9/D8LeLj5Yngd2HDOSfYga7XU0tO+09UfOfY9XsFkh2eGIbGyaBcB5k8SeKtK1isbQ43LlvlvN7zvMvsGyNWiyaxwqvCCudVcECqQp1QG7uOqC+3bwPkgjgBlxQABKZzepIDb83SdyDpbW2kyzwnRImVuA1cfqtHMlYZLxSvSlv0+ntnyRjr2/wB3eP7RtsSPFdFiGbnHoBo0cgqi95vO8u4wYKYccY6dUOssW4QEBAQEHJrSSAASTgBeT3DVOt5MxEbyzVi7J26Jf7KgHWIQzyO95LdXT5LdiBl4ppcf5t/Ln/H7srB+T60HPFht7g5w/YLbGjt2zCFbj2KPu0mfdH1fV3yeRNLQ0/7Z/uWXqc97D/P1/wDHPv8A4da0dgbUMkSE/lNwPhIjzWM6O8dUw2047gn71Zj3Swlv2Da4N8SC8DiAHDqWzl1Wi2K9euFhh12ny8qXjf3fFjQVrSxAQZjs5sCJa4khMQ2/SP4fhbxd+2J0nuw4ZyT7EDXa6mlp32nqj5z7Hq9gsUKDCbDhtDQ0XD3nieeqtK1isbQ43LlvlvN7zvMvu2/N00WTWgJnI5fUkBxIy4IK6Qy4oAAlM5vUkBl+bpO5BaGcvFBKaL8UCme95dyBn5SQeX9udte3j+zaf8OCS0cHPwc/3DrxVZqcvTttHVDr+E6P0OLp2+9b9o7I+bWVGWwgICAgoH/pHk8m37E7DRXgRLSTDacGD6Q/m0Z3XnuUvFpZtztyUer41Sn2cPOe/s/n+9bedmbIs8Bv+DDazicXGXFxvKnUx1p92HPZ9Tlzzvktv/e53c/KSzaCqe759yBVTcgU034oFM971cgwu1ezFltUyWezf9tkgSfxDB3Vacmnpfs5p+m4lnwconeO6Xn23+zceykl2/DndEaLv1D6v7c1X5cFsfk6bR8RxanlHK3dPy73Ds7sF9qiSvbDaf8AEfw/C3i4+WJ0mw4ZyT7Huu11NLTvtPVHzn2PV7FYodnhtZDaA0CQA/c8TzVpWsVjaHG5ct8t5ved5l9qZ73l3LJrXPykgVT3fNAqpuxQKab8UCme95dyBn5SQPm/NBGgjNggEGcxl9TQdDb9oLYLvZupc4FrSNCRj0vUDiWtjSYen2zyj++yErR44vljpRvEc5eQ2uyPhOpeJcDoRxCrMGemavSpLtqZa5I3q663NogICD6QIL3uDGNLnOMmtGJK9iJmdoY3vWlZtadoh6f2W7LQrKA+LJ0c64hnJnP8X7Kyw6eKc563IcQ4lbUT0acqfHz+jYmgjNgpKrCDOYy+poK6/L1lcgGUpDN6mgNkM2KCNBGbBAIM5jL6mgrr8vWVyCRGtc0tkCSJEEY8QUexMxO8PlYrNCgsENrWtaMGgXCd/wC815WsVjaGWTJfJbpXneX1aCM2C9YBBnMZfU0Fdfl6yuQDKUhm9TQGyGbFBGgjNggEGcxl9TQV1+XrK5Bxofz8UFa6q4oBdI06fFBrm3ooMWkYMEupvPuHRcTx7U+k1Po46q/Gev5LjRY+jj6XexFps7IjaXiY/bmOCqMWa+K3SpO0p9L2pO9Wr7U2S+FeN5n2tR+b4ro9JrqZ+U8rd30WmHU1ycp5SxinJQgIPTuxXZ35vC9vEH+M8XA/5bTg38xxPhpfZafD0I6U9bkeK6/09/R0n7MfvPf9Pe2hoqvKlKhGmq4oBdI06fFBXbuGqAWyFWqA0VXlAaarighdI06IK7dw1QC2Qq1QGiq8oDTVcUELpGnRBXbuGqAWyFWqA0VXlAaarighdI06IK7dw1Qcfbu5IOTnVXBBxfFDWmegMz5rDJeMdJvPVEb+57WJtO0NMe8kknEkk9V8zyZJyXm89czu6KKxWIiEWD1CF7E7c4GA2rsLF8Ed7P7fh/8AFd6Pie/2M3v+v1WGDV/lye9gCJYq6jmsIndsfYXZIjWj2jxOHCk48HP+o3yn0HFSNNj6Vt56oVXF9X6HD0Kzzty/Tt+j1ENkatFaOQHCq8IK51VwQKpCnVAbu46oIGyNWiA4VXhBXOquCBVIU6oDd3HVBA2Rq0QHCq8IK51VwQKpCnVAbu46oIGyNWiA4VXhBXOquCBVIU6oDd3HVBfbt4HyQRwAy4oOjtmIBAcTmMh4n4TVXxnL6PR39vL3/wAJOkr0ssNXXArsQEBBjtp7KZFvG6/joeTvip+k198H2Z51+Hkk4NRbHO084bd2Q2WIFla14k503v7z8Gho6Lu9LEeirMdvP3qHiWo9PqJtHVHKP75swCZyOX1JSEAcSMuCCukMuKAAJTOb1JAbfm6aIICZyOX1JB0tobYs8B4Y+K1hInIzwJInhyK3Y9NlyRvSu8NV81KTtadnwd2ksIyx2T/V8Fs9R1Hglj6zi8SDtJYZTMds/wBXwT1HUeCT1nF4hvaWwnNHZyx+Ceo6jwSes4vEDtLYpyMdsuvwT1HUeCT1nF4h3aWxDLHbLr8E9R1Hgk9ZxeId2ksIyx2T/V8E9R1Hgk9ZxeJR2ksMpmOyf6vgnqOo8EnrOLxI3tLYTmjs5ZvgnqOo8EnrOLxA7TWKcjHZLr8E9R1Hgk9ZxeId2lsQyx2S6/BPUdR4JPWcXiHdpbCMsdk/1fBPUdR4JPWcXid2wW6BHaXw3h8jIkTxlMD9lpyYr452vGzZTJW8b1nd2W35uk7lrZrQzl4oJTRfigxHaN243m7DuB+K53/kd9sFK99vhH8p/D4+3M+xgFx61EBAQc4DKnBvEgea3YMfpMtad8xH7sb26NZnubkBVykvpcRtyhzq1T3fNehVTdigU034oFM97y7kDPykgVT3fNB538oTJWtv+i3+eIui4T+DPnPwhU6/8SPL6tYVohCAgICAgICAgIC8G5fJxF3ozJ6NcB3Eg/uFTcYpypbzhY6C3OYbzn5SVGsj5vzQRoIzYIML2lN7OG9L/iuW/wCSz+FH/t8llw/836MIuWWQgICDt7JE47O+fgCVZcIrvrMce35Sj6qdsNm1uvy9ZL6AowylIZvU0BshmxQRoIzYIBBnMZfU0Fdfl6yuQDKUhm9TQedfKCD87bP7lv8APEXRcJ/Anz+UKnX/AIseX1ayrRCEBAQEBAQEBAQEGy/J+6VrI0MJ0/8AyYfcqvi0f6In2x80zQz/ALP0ejOvy9ZLnVu40P5+KCtdVcUGE7SiRYOFX9K5X/kvXi/+vksuH/m/RhVy6yEBAQdzY/07O8jxaQrPg87a3H+vwlH1cf6ZbU7dwXfqMLZCrVAaKrygNNVxQQukadEFdu4aoBbIVaoPOvlCfO1t/wBFv88RdFwn8CfP5Qqdf+JHl85ayrRCEBAQEBAQEBAQEGxdgv8ArP8Abf8A0hVvFfwP1hL0X4v6S9Jdu4arm1w4+3dyQcnOquCDDdo27rOIJHiJ+5c3/wAkpvjx27pmPfH8LDh8/atDBLkVoICAg+1ifTEafxD95FStFk9HqMdu6Ya81eljtHsbg3dx1X0hz6BsjVogOFV4QVzqrggVSFOqA3dx1QQNkatEHnnyhuBtbf8ARb/PEXRcJ/Anz+UKnX/ix5fOWsK0QhAQEBAQEBAQEBBtHyet/wD1PP8A2XDqXsl71VcXn/TEe35Sm6CP9k+T0Nu7jqueWy+3bwPkgjgBlxQY7bsMGAScQQfOXvVNx7H09HM90xPy+aXorbZYjva0uGXIgICD5WmOxjanGQ/fkOK3YcF81uhSN5aNRqcenp08k7R/ept+xrc20QGRftDXQi5w8QV9HwTacdel17c/Nz+PLXLHTr1S7YJnI5fUltZjiRlwQV0hlxQABKZzepIDb83TRBATORy+pINL7bbGtEa0tdBhF7RCaCQRjW8kXngR4q64dqsWLFNb22nf5QrdXhvfJE1jfk1/+Grd9w7oWf3Kw/yGm8fxRfVc3hP4Zt33DvFn9yf5DTeP4nqubwn8M277h3UsH9Sf5DTeP4nqubwn8M277h3iz4p/kNP4/ieq5vCfwzbvuHeLPin+Q03j+J6rm8J/DNu+4d4s/uT/ACGm8fxPVc3hY+1WZ8J5ZEbS4Sm0ymJgEeRCkY8lclelWd4arVms7S+K2MRAQEG6fJvBvjvPBjW9+8T/AEqk4xb7lfOVjoK/elu7b83SdypFktDOXiglNF+KD5WqB7RjubT+1y0anD6bDbH3xMM8duheLdzTl81225S6EXgIOltDaLIQli7RvvPBT9HoMmpnfqr3/RW6/ieLSRt127vr3NatVpfEdU4z4cByC6rBp8eCnRpH8uM1Oqy6i/TyTvPw8m2fJ7tHedZnGVU3w++W+3wAPQqfgv8AlS+H5uc4584b5VPd81KWxVTdigU034oFM97y7kDPykgVT3fNAqpuxQKab0Cme95dyBn5SQKp7vn3IFVN2KCOkwVE3a8tZoTOzx/alr9tHiRftvJHIfVHQSC7DBj9HjrTuhz+W/TvNu91VuYCAgIPSOwdjpsgf9t7ndBuD+XzXNcUydLPt3Rt81xoq7Yt+9seflJVyWfN+aCNBGbBAM5zGX1NBq214IbGdLA7w64+c1wHF9P6DVWiOqecfr/O680t+nij2cnTVYkMNtLbIE2wrzq7Qfl4nmr3Q8Jm218/V3fVznEeNRXfHp+c9s93l9epgXOJMzeTiTiV0URERtHU5a1ptMzM7zKL14+kCM5jg9hk5pBaRoRgkTtO72Jms7x1vWdhbWZaoAe25+D26tdr0OIKn479KN3Q6fNGWnS7e1kWyGbFZt6NBGbBAIM5jL6mgrr8vWVyAZSkM3qaA2QzYoI0EZsEAgzmMvqaCuvy9ZXIBlKQzepoDZDNig1jtxtQwoPsgd+KCPys+seuXqeCsuGaf0mXpz1V+KHrMvRp0Y65+DztdIqBAQEFa0kgATJMgOJOAXkzERvJtu9h2fZfZQmQxlY1rZ8ZCRPUzXG5ck5Lzee2XQUr0axXudl1+XqsGbjQ/n4oK11VxQC6Rp0QYrtJAaIXtPsTJP4dVScb0NtRii1I+1X4T/d0rS6iuGZm88tvg852ltV0Tdbus83d/Lkomh4ZTB9q/O37R5fVScR4vfU70x8qfvPn9PexqtFOICAgyGxNrRLLFERl+jmnB44HnwOnisqXms7w3Yc1sVulD1PZW0IVqh+0Y6ehGrTjJw0KnVtFo3hfYstctelV2muquKybQukadEFdu4aoBbIVaoAFV5QGmq4oIXSNOiCu3cNUAtkKtUHQ2vtSFAhGLEPJrRi84gD46Lfp8F81+jX/AKa8uWuOu8vLNpW6JHiuixDNzj0A0aOQXVYcNcNIpXsUeTJN7TaXWW1gICAgz/YnZ3trUCcsIVnvwYPG/wDSVX8Szejw7R125fVK0ePpZN+7m9LLpGnRcyuVdu4aoOPt3ckHJzqrggB0hTqg4uYACHCYcJEcRgQUeTG8bS8l2/ss2aO6HfTmhk6sOXqMDzCgZKdGdnO6jD6LJNfd5MasGkQEBAQdrZu0IsB9cJ0jqNHDg4ahe1tNZ3hsxZbY7dKr0PY3ayBaAGPlCicHHdd+V3uN/epdM0W61xg1tMnKeU/3qbCHSFOq3Jo3dx1QQNkatEBwqvCCudVcECqQp1QG7uOqDX9t9qIFnJDSIkS/cabm/nOA7sV7jtjnJFL22jvRM2sx4+Uc5ef7T2jFtEQxIrpnQYBo+y0aBddgw0xU6NP+1VkyWyTvZ1FvYCAgICD03shsv2NmAIlEiGt89BLdb0HmSuW4hn9Nl5dUcoXWlxejpz65Z4OkKdVCSRu7jqgvt28D5II4AZcUAASmc3qSA2/N00QYPtVsX51Ck0b7JmEePFhPAyHUBa8tOlCLq9P6WnLrjq+jy5wIJBEiDIg4gjEFQVAiAgICAgIMrsztDaoEgyJNowa/eaO7UdCFnXLaqRj1WXH1Ty9rZbJ29afp4Lu+GQfIyl4lbo1HfCbTiUfmr7mThds7Ecz3NHAsd7gVsjNRIjX4Z7f2fZ3a2wDLGu/JE/tT01O9l67h8T4xu2dhbkc9x5Md/VJeTnownX4Y7f2Yu1dvW/5cAk/ae6XkJz8VhOo7oaL8Sj8tfe13afaW1x7nxJN+yzdHXU9SVptltZCyarLk659zEBYI6gq10HFL6b7Nudfh5fRlFtnJddhzUzUi9J3hsFtBAQZ/sfscx41bmzhwyC665zsWt955d6ruI6r0WPox1z8O9K0mH0lt56oemOkMuK5pcgAlM5vUkBt+bpogtDOXiglNF+KBTPe8u5Az8pIFU93zQaZ227OkzjwhN0pxWjUfbHMa8f3j5sX5oVmt0u/+yn6/VoiiqkQEBAQEBAQEBAQEBAQEFUnS6vJpr9Kk+cdkvYnZQV2Oi1+PVV+zyntj+9jZE7qpz129l7PiWiK2FDF5xOjRq48h8AtOfNXDSb2Z48c5LdGHq2zbGyzQ2wmC4DHUk4uPMrk82a2W83svceOMdYrDtU034rWzKZ73l3IGflJA+b80EaCM2CAQZzGX1NBXX5euiAZSkM3qaA0gZsUGjdrOyjhOPAbdi+GPNzB+48OCjZcPbCq1ej/Pjjzj6NKUZViAgICAgICAgICAgICAgLKl7UtFqztMDtbPscWPEEOG2px8ANS46Dmuo0XGa3r0c3KY7Y7f5/Zux1tkno1jm9Q2BsaHZoVDb4hl7R+pPAcGi+Q+KgarVWz33nq7IXuDBGKu3ayjSBmxUZuRoIzYIBBnMZfU0Fdfl6yuQcaH8/FBWuquKAXSNOiCu3cNUAtkKtUACq8oDTVcUGrdpeyTIri+DJkTUfVeef2Xc/HitGTDE84QNToov9qnKfi0C1WaJCeWRGlrhiDj38xzFyizWY61PatqztaNpfFeMRAQEBAQEBAQEBAQEGT2JsSNanSYJNnvRDlb3faPIeSzpSbdTfg0980/Z6u96XsnZMKyMphCZOdxzOI4/BTKUisbQvMOCmKu1WQLZCrVZtw0VXlAaarighdI06IK7dw1Qcfbu5IOTnVXBADpCnVAbu46oIGyNWiA4VXhBXOquCBVIU6oOjtPZUCMymMwO+yRmbzacQsbUi3W1ZcNMsbWhpG2OxUeGK4J9qzhcIgHMYO6eCi2wTHVzVWbQXrzpzj92sPaQSCCCMQRIjvGi0oMxMcpcUeCAgICAgICAg7FisUWM6mExz3cGjDvOA7yvYrM9TOmO152rG7cdidiBc60Omfu25f1OxPcPEqRTB22WWHh+3PJP6NygsaxohtaAAJAAAAdykRGyzisRG0Obd3HVevUDZGrRAcKrwgrnVXBAqkKdUBu7jqgvt28D5II4AZcUAASmc3qSA2/N00QQEzkcvqSA6Yy4IK6Qy4oAAlM5vUkBt+bpoggJnI5fUkHT2nsuBGEnw2vEsZbw7nC8eKxtStuuGvJhpkj7Ubtb2j2Dhm+BFcPwuFQ6ESI6zWm2njslAycNrP3J282BtXY+2swY1/5HCfg6RWqcN4RL6HNXs38mLj7MtDM8GI3vY6XjKS1zW0dcNFsWSvXWfc6jrrjcvNpYTEx1pUOIR5u5w2l1zQT3CabS9iJnqd2z7Ftb8sCJ1aWjxMgsopaextrgy26qyy9i7E2t/0hZCH4jN3QC4+K2RgtPWkU4flnr2hn9ndiLMwgxS6L37rPAX+JK21wVjrTMfD8dfvc2yQoDYYDYTQ1vBoAC3RER1JtaxWNojZ9XSGXFesgASmc3qSA2/N00QQEzkcvqSA6Yy4IK6Qy4oAAlM5vUkBt+bpogtDOXiglNF+KBTPe8u5Az8pIFU93z7kCqm5AppvxQKZ73l3IGflJAqnu+aBVTdigU03oFM97y7kDPykghkd0jqmzzaHGhrbqR4BebQdGO5zpov8AJevdime95dyBn5SQKp7vn3IFVNyBTTfigUz3vLuQM/KSBVPd8+5AqpuQKab8UCme95dyBn5SQPm/NBbTh1QGZOh96CWbVBxZn6n3oFozdEHO0YDv9yAzJ0PvQSzaoOLM/U+9AtGbog52jAd/uQGZOh96CWbVBxZn6n3oFozdEHO0YDv9yAzJ0PvQSzaoOLM/U+9AtGbog52jAd/uQGZOh96CWbVBxZn6n3oFozdEHO0YDv8AcgMydD70Es2qD7oP/9k=" alt="Google Login" className="login-icon" />
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTldN0CDJQJkxVvRVkOOZy4EVCOUcKVVUkPfA&s" alt="Apple Login" className="login-icon" />
                </div>
        </div>
    );
}

export default NGOLogin;
