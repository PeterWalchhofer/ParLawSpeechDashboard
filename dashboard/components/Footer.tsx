import { HTMLAttributes } from "react";
import { OptedLogo } from "./OptedLogo";
import { Link } from "@mui/material";
import { GitHub } from "@mui/icons-material";

type DivProps = HTMLAttributes<HTMLDivElement>;

interface MyComponentProps extends DivProps {
  // Define any additional props you want to pass to MyComponent here
}

export const Footer = ({ children, ...rest }: MyComponentProps) => {
  // Render a div element and pass any additional props to it
  return (
    <div {...rest}>
      <hr
        style={{
          marginBottom: "20px",
          border: "none",
          backgroundColor: "#949494",
          height: "1px",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a href="https://opted.eu/">
          <OptedLogo
            style={{
              marginRight: "20px",
            }}
          />
        </a>
        <div
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            color: "#CCCCCC",
          }}
        >
          <div>
            This project has received funding from the European Union’s Horizon
            2020 research & innovation programme under grant agreement No
            951832. The document reflects only the authors’ views. The European
            Union is not liable for any use that may be made of the information
            contained herein. Although the information found on this system has
            been produced and processed from sources believed to be reliable, no
            warranty, express or implied, is made regarding accuracy, adequacy,
            completeness, legality, reliability or usefulness of any
            information.
            <br />
            The Dashboard was created by{" "}
            <Link href="https://twitter.com/PeterWalchhofer" underline="none">
              Peter Walchhofer
            </Link>{" "}
            for a project at TU Wien.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              alignContent: "center",
              height: "50px",
              textAlign: "center",
            }}
          >
            <div>
              <Link style={{ marginRight: "10px" }} href="/imprint">
                {" "}
                Imprint
              </Link>
            </div>
            {/* <div><Link style={{marginRight: "10px"}} href="/about">About</Link></div> */}
            <div>
              <Link
                style={{ marginRight: "10px", display: "flex" }}
                href="https://github.com" target="_blank"
              >
                Source Code <GitHub style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
