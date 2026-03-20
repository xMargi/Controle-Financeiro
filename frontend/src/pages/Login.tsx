import { ErrorMessage } from "@hookform/error-message"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import "../styles/login/login.css"

interface LoginForm {
    email: string,
    password: string
}

export const Login = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

    const onSubmit = async (data: LoginForm) => {

        try {
            const dataAxios = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email: data.email,
                password: data.password
            })

            localStorage.setItem("token", dataAxios.data.token)

            navigate("/page/dashboard")

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className="w-full h-screen bg-black flex items-center justify-center py-8 lg:py-0">
            <div className="w-[90%] lg:w-[80%] h-auto min-h-[500px] lg:h-[90%] bg-white rounded-[2em] lg:rounded-[3em] overflow-hidden flex flex-col lg:flex-row">
                <div className="hidden lg:flex w-[40%] h-full items-center justify-center overflow-hidden">
                    <video src="/video/dragao.mp4" autoPlay loop muted playsInline className="mix-blend-multiply contrast-[1.1] brightness-[1.1] scale-[1.7] object-cover"></video>
                </div>
                <div className="w-full lg:w-[60%] bg-blue-500 lg:h-full rounded-[2em] lg:rounded-[3em] shadow-none lg:shadow-[-5px_0_20px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center p-8 lg:p-20 py-16">
                    <h1 className="uppercase text-white text-5xl lg:text-7xl font-pachang font-bold relative border-title mb-12 lg:mb-20">Login</h1>

                    <form action="" className="flex flex-col gap-10 w-full items-center justify-center text-white px-4 lg:px-20" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="flex flex-col w-full relative">
                            <input type="email" id="email" className="border-2 outline-none p-3 rounded" required {...register('email', { required: "Informe o email por favor!" })} />
                            <ErrorMessage errors={errors} name="email" render={({ message }) => <p>{message}</p>} />
                            <label htmlFor="email" className="uppercase labelFormLogin">Digite seu email</label>

                        </div>
                        <div className="flex flex-col w-full relative">
                            <input type="password" id="password" className="border-2 outline-none p-3 rounded" required {...register('password')} />
                            <label htmlFor="password" className="uppercase labelFormLogin">Digite sua senha</label>
                        </div>
                        <div className="mt-10">
                            <button className="uppercase bg-white text-blue-500 font-pachang p-6 text-xl rounded cursor-pointer" type="submit">Realizar Login</button>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm">
                                Não tem conta?{' '}
                                <span
                                    onClick={() => navigate('/auth/register')}
                                    className="text-white font-semibold cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Cadastre-se
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )

}