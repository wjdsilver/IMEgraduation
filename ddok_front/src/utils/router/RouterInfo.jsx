/* 기본(베이스) 레이아웃 */
import App from '../../App';

/* 로그인 */

/* 서비스 */
import Result from '@components/result/Result';
import Login from '@components/users/Login';
import SignUp from '@components/users/SignUp';
import InterviewSetting from '@components/interview/InterviewSetting';
import Criterion from '@components/criterion/Criterion';
import About from '@components/about/About';
import InterviewPage from '@components/interview/InterviewPage';
import ResultList from '@components/resultList/ResultList';
import InterviewRecord from '../../components/interview/InterviewRecord';

export const RouterInfo = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <App/>,
      },
      {
        path: 'criterion',
        element: <Criterion/>,
      },
      {
        path: 'interview',
        element: <InterviewSetting />,
      },
      {
        path: 'result/:interviewId',
        element: <Result />,
      },
      {
        path: 'list',
        element: <ResultList />,
      },
      {
        path: 'users',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'about',
        element: <About/>,
      },
      {
        path: 'interview/start',
        element: <InterviewPage/>
      },{
        path: 'interview/record',
        element: <InterviewRecord/>
      }
    ],
  },
];