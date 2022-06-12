import { Link } from "react-router-dom";
import { Header, List } from "semantic-ui-react";
import { useIndexList } from "../../lib/login";
import { link_index } from "../../lib/navigation";
import { useAppSelector } from "../app/hooks";
import { selectAmcatUser } from "../Menu/LoginSlice";

export default function IndexChoice() {
  const user = useAppSelector(selectAmcatUser);
  const indices = useIndexList(user);

  if (user == null || indices == null) return null;
  return (
    <>
      <Header>Indexes on {user.host.replace(/^https:\/\//, "")}:</Header>
      <List divided relaxed>
        {indices.map((i) => (
          <List.Item key={i.name}>
            <Link to={link_index({ index: i.name, ...user })}>
              <List.Header>{i.name}</List.Header>
            </Link>
          </List.Item>
        ))}
      </List>
    </>
  );
}
