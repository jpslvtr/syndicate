import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  const footerStyle = {
    position: 'fixed',
    bottom: 10,
    width: '100%',
    zIndex: 1000, // Ensure it stays on top of other content
  };

  return (
    <footer style={footerStyle} className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}
          {" "}
          {<b>Syndicate</b>}
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Syndicate",
  brandLink: "https://www.creative-tim.com",
  routes: [
    // { name: "hello", path: "https://www.creative-tim.com" },
    // { name: "About Us", path: "https://www.creative-tim.com/presentation" },
    // { name: "Blog", path: "https://www.creative-tim.com/blog" },
    // { name: "License", path: "https://www.creative-tim.com/license" },
  ],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
