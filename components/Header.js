import React from "react";
import { Icon, Menu, MenuItem, MenuMenu } from "semantic-ui-react";
import { Link } from "../routes";
export default () => {
  return (
    <Menu style={{ marginTop: "20px" }}>
      <Link route="/" style={{ alignContent: "center", marginLeft: "10px" }}>
        CampaignFund
      </Link>

      <MenuMenu position="right">
        <Link route="/" style={{ alignContent: "center", marginLeft: "10px" }}>
          Campaigns
        </Link>
        <Link
          icon="plus"
          route="/campaigns/new"
          style={{
            alignContent: "center",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <Icon link name="plus"></Icon>
        </Link>
        {/* <MenuItem icon="plus"></MenuItem> */}
      </MenuMenu>
    </Menu>
  );
};
