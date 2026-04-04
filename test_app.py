import unittest
import json
from app import app
from solver import solve


class SudokuAppTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.app = app

    def test_home_page_loads(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)

    def test_solver_solves_valid_board(self):
        board = [
            [0, 6, 0, 3, 0, 0, 4, 1, 0],
            [1, 8, 5, 0, 2, 0, 7, 0, 3],
            [0, 0, 0, 5, 0, 0, 9, 2, 8],
            [0, 9, 6, 8, 0, 2, 0, 5, 7],
            [2, 1, 0, 0, 4, 0, 3, 0, 0],
            [0, 5, 0, 0, 0, 6, 0, 8, 4],
            [5, 0, 0, 0, 0, 4, 6, 0, 0],
            [0, 0, 0, 6, 1, 3, 5, 4, 0],
            [0, 0, 9, 0, 0, 7, 0, 0, 0]
        ]

        result = solve(board)
        self.assertTrue(result)

        for row in board:
            self.assertNotIn(0, row)

    def test_solver_rejects_invalid_board(self):
        board = [
            [5, 5, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

        result = solve(board)
        self.assertFalse(result)

    def test_solve_api_returns_solved_board(self):
        board = [
            [0, 6, 0, 3, 0, 0, 4, 1, 0],
            [1, 8, 5, 0, 2, 0, 7, 0, 3],
            [0, 0, 0, 5, 0, 0, 9, 2, 8],
            [0, 9, 6, 8, 0, 2, 0, 5, 7],
            [2, 1, 0, 0, 4, 0, 3, 0, 0],
            [0, 5, 0, 0, 0, 6, 0, 8, 4],
            [5, 0, 0, 0, 0, 4, 6, 0, 0],
            [0, 0, 0, 6, 1, 3, 5, 4, 0],
            [0, 0, 9, 0, 0, 7, 0, 0, 0]
        ]

        response = self.client.post(
            "/solve",
            data=json.dumps({"board": board}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertEqual(data["status"], "solved")

        solved_board = data["board"]
        for row in solved_board:
            self.assertNotIn(0, row)

    def test_solve_api_returns_error_for_invalid_board(self):
        board = [
            [5, 5, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

        response = self.client.post(
            "/solve",
            data=json.dumps({"board": board}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertEqual(data["status"], "error")


if __name__ == "__main__":
    unittest.main()