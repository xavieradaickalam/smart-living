<%@ page session="true"%>
<%
    session.invalidate();
    response.sendRedirect("index.jsp");
%>
<%@ page language="java" contentType="text/html; charset=windows-1255"  pageEncoding="windows-1255"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1255">
<title>MyApp</title>
</head>
<body>
</body>
</html>