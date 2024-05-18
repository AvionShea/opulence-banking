import Link from 'next/link'
import Image from 'next/image'

const Sidebar = ({user}: SiderbarProps) => {
  return (
    <section className='sidebar'>
        <nav className='flex flex-col gap-4'>
            <Link href="/" className="mb-12 cursor-pointer items-center gap-2">
                <Image 
                    src="/icons/logo.svg"
                    width={34}
                    height={34}
                    alt='Lotus Banking logo'
                />
            </Link>
        </nav>
    </section>
  )
}

export default Sidebar