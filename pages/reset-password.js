import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

export default function ResetPassword(props) {
  const router = useRouter();
  return <div>{JSON.stringify(router.query, null, 2)}</div>;
}

ResetPassword.propTypes = {};
