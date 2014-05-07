<html>
<head>
<title>Login</title>
<body bgcolor="white">
<form method="POST" action='<%= response.encodeURL("j_security_check") %>' >
  <table>
    <tr>
      <th align="right">Username:</th>
      <td align="left"><input type="text" name="j_username" id="user_input"></td>
    </tr>
    <tr>
      <th align="right">Password:</th>
      <td align="left"><input type="password" name="j_password" id="password_input"></td>
    </tr>
    <tr>
      <td align="right"><input type="submit" value="Login" id="loginButton"></td>
      <td align="left"><input type="reset"></td>
    </tr>
  </table>
</form>
</body>
</html>