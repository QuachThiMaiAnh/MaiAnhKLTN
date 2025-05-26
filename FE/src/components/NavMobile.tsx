import { NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import { GiHamburgerMenu } from "react-icons/gi";
import { ModeToggle } from "./mode-toggle";

const NavMobile = () => {
    return (
        <section className="max-w-[264px] lg:hidden">
            <Sheet>
                <SheetTrigger>
                    <GiHamburgerMenu className="text-white text-2xl cursor-pointer " />
                </SheetTrigger>
                <SheetContent className="bg-black text-white" side="left">
                    <nav className="flex flex-col gap-3 ">
                        <NavLink to="/shop" className="text-2xl font-medium py-2">
                            Shop
                        </NavLink>
                        <NavLink to="/category" className="text-2xl font-medium py-2">
                            Category
                        </NavLink>
                        <NavLink to="/blog" className="text-2xl font-medium py-2">
                            Blog
                        </NavLink>
                        <ModeToggle />
                    </nav>
                </SheetContent>
            </Sheet>
        </section>
    );
};

export default NavMobile;