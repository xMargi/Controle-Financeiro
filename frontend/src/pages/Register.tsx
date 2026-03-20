import "../styles/register/register.css"
import { useForm } from 'react-hook-form'
import { ErrorMessage } from "@hookform/error-message"
import axios from "axios"
import { useNavigate } from "react-router-dom"


interface registerForm {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export const Register = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<registerForm>()

    const onSubmit = async (data: registerForm) => {
        if (data.password !== data.confirmPassword) {
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                name: data.name,
                email: data.email,
                password: data.password
            })

            navigate("/auth/login")

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className="w-full h-screen bg-black flex items-center justify-center py-8 lg:py-0">
            <div className="w-[90%] lg:w-[80%] h-auto min-h-[600px] lg:h-[90%] bg-white rounded-[2em] lg:rounded-[3em] overflow-hidden flex flex-col lg:flex-row">
                <div className="hidden lg:flex w-[40%] h-full items-center justify-center overflow-hidden">
                    <video src="/video/monstro.mp4" autoPlay loop muted playsInline className="mix-blend-multiply contrast-[1.1] brightness-[1.1] scale-[1.7] object-cover"></video>
                </div>
                <div className="w-full lg:w-[60%] bg-green-500 lg:h-full rounded-[2em] lg:rounded-[3em] shadow-none lg:shadow-[-5px_0_20px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center p-8 lg:p-20 py-16">
                    <h1 className="uppercase text-white text-4xl lg:text-7xl font-pachang font-bold relative border-title mb-12 lg:mb-20">cadastro</h1>

                    <form action="" className="flex flex-col gap-10 w-full items-center justify-center text-white px-4 lg:px-20" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="flex flex-col w-full relative">
                            <input type="text" id="name" className="border-2 outline-none p-3 rounded w-[100%]" required {...register('name')} />
                            <label htmlFor="name" className="uppercase labelFormRegister">Digite seu nome</label>
                        </div>

                        <div className="flex flex-col w-full relative">
                            <input type="email" id="email" className="border-2 outline-none p-3 rounded" required {...register('email', { required: "Informe o email por favor!" })} />
                            <ErrorMessage errors={errors} name="email" render={({ message }) => <p>{message}</p>} />

                            <label htmlFor="email" className="uppercase labelFormRegister">Digite seu email</label>

                        </div>
                        <div className="flex flex-col w-full relative">
                            <input type="password" id="password" className="border-2 outline-none p-3 rounded" required {...register('password')} />
                            <label htmlFor="password" className="uppercase labelFormRegister">Digite sua senha</label>
                        </div>
                        <div className="flex flex-col w-full relative">
                            <input type="password" id="confirmPassword" className="border-2 outline-none p-3 rounded" required {...register('confirmPassword')} />
                            <label htmlFor="confirmPassword" className="uppercase labelFormRegister">Confirme sua senha</label>
                        </div>
                        <div className="mt-10">
                            <button className="uppercase bg-white text-green-500 font-pachang p-6 text-xl rounded cursor-pointer" type="submit">Realizar cadastro</button>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm">
                                Já tem conta?{' '}
                                <span
                                    onClick={() => navigate('/auth/login')}
                                    className="text-white font-semibold cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Faça Login
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}