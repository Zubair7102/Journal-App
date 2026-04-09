#!/bin/bash
set -e

BASE="http://localhost:8081"
TESTUSER="finaltest_$(date +%s)"
PASS=0
FAIL=0

check() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" = "$expected" ]; then
    echo "  ✅ $name -> HTTP $actual"
    PASS=$((PASS+1))
  else
    echo "  ❌ $name -> HTTP $actual (expected $expected)"
    FAIL=$((FAIL+1))
  fi
}

echo "============================================"
echo "  Journal App - Comprehensive Flow Test"
echo "  Test User: $TESTUSER"
echo "============================================"

# 1. Health Check
echo ""
echo "--- Public Endpoints ---"
CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE/public/health-check)
check "Health Check" "200" "$CODE"

# 2. Signup
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/public/signup \
  -H "Content-Type: application/json" -d "{\"userName\":\"$TESTUSER\",\"password\":\"Test@123\"}")
check "Signup" "201" "$CODE"

# 3. Duplicate Signup
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/public/signup \
  -H "Content-Type: application/json" -d "{\"userName\":\"$TESTUSER\",\"password\":\"Test@123\"}")
check "Duplicate Signup" "409" "$CODE"

# 4. Login
RESP=$(curl -s -w "\n%{http_code}" -X POST $BASE/public/login \
  -H "Content-Type: application/json" -d "{\"userName\":\"$TESTUSER\",\"password\":\"Test@123\"}")
CODE=$(echo "$RESP" | tail -1)
JWT=$(echo "$RESP" | head -1)
check "Login" "200" "$CODE"

# 5. Wrong Login
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/public/login \
  -H "Content-Type: application/json" -d "{\"userName\":\"$TESTUSER\",\"password\":\"wrong\"}")
check "Wrong Login" "400" "$CODE"

# --- Journal CRUD ---
echo ""
echo "--- Journal CRUD ---"

# 6. Create Entry 1
RESP=$(curl -s -w "\n%{http_code}" -X POST $BASE/journal \
  -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" \
  -d '{"title":"Entry One","content":"Content 1"}')
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -1)
ID1=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
check "Create Entry 1 (id=$ID1)" "201" "$CODE"

# 7. Create Entry 2
RESP=$(curl -s -w "\n%{http_code}" -X POST $BASE/journal \
  -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" \
  -d '{"title":"Entry Two","content":"Content 2"}')
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -1)
ID2=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
check "Create Entry 2 (id=$ID2)" "201" "$CODE"

# 8. Get All Entries
RESP=$(curl -s -w "\n%{http_code}" $BASE/journal -H "Authorization: Bearer $JWT")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -1)
COUNT=$(echo "$BODY" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
check "Get All Entries (count=$COUNT)" "200" "$CODE"

# 9. Get Entry By ID
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/journal/id/$ID1" -H "Authorization: Bearer $JWT")
check "Get Entry By ID" "200" "$CODE"

# 10. Update Entry
RESP=$(curl -s -w "\n%{http_code}" -X PUT "$BASE/journal/id/$ID1" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" \
  -d '{"title":"Updated Title","content":"Updated Content"}')
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -1)
TITLE=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])")
check "Update Entry (title=$TITLE)" "200" "$CODE"

# 11. Delete Entry 2
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/journal/id/$ID2" -H "Authorization: Bearer $JWT")
check "Delete Entry 2" "204" "$CODE"

# 12. Verify Delete
RESP=$(curl -s $BASE/journal -H "Authorization: Bearer $JWT")
COUNT=$(echo "$RESP" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
if [ "$COUNT" = "1" ]; then
  echo "  ✅ Verify Delete (1 entry remaining)"
  PASS=$((PASS+1))
else
  echo "  ❌ Verify Delete ($COUNT entries, expected 1)"
  FAIL=$((FAIL+1))
fi

# --- User Management ---
echo ""
echo "--- User Management ---"

# 13. Update User Password
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT $BASE/user \
  -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" \
  -d "{\"userName\":\"$TESTUSER\",\"password\":\"NewPass@456\"}")
check "Update User Password" "200" "$CODE"

# 14. Login with New Password
RESP=$(curl -s -w "\n%{http_code}" -X POST $BASE/public/login \
  -H "Content-Type: application/json" -d "{\"userName\":\"$TESTUSER\",\"password\":\"NewPass@456\"}")
CODE=$(echo "$RESP" | tail -1)
JWT2=$(echo "$RESP" | head -1)
check "Login New Password" "200" "$CODE"

# 15. Access with New JWT
CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE/journal -H "Authorization: Bearer $JWT2")
check "Access With New JWT" "200" "$CODE"

# 16. Delete User
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE $BASE/user -H "Authorization: Bearer $JWT2")
check "Delete User" "204" "$CODE"

# 17. Verify deleted user can't login
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/public/login \
  -H "Content-Type: application/json" -d "{\"userName\":\"$TESTUSER\",\"password\":\"NewPass@456\"}")
check "Deleted User Login Fails" "400" "$CODE"

# --- Security ---
echo ""
echo "--- Security Tests ---"

# 18. No Token Access
CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE/journal)
check "No Token => 403" "403" "$CODE"

# 19. Invalid Token
CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE/journal -H "Authorization: Bearer invalid.token.here")
check "Invalid Token => 403" "403" "$CODE"

# 20. Swagger
CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE/swagger-ui.html)
check "Swagger UI Redirect" "302" "$CODE"

# 21. API Docs
CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE/v3/api-docs)
check "API Docs" "200" "$CODE"

echo ""
echo "============================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "============================================"
